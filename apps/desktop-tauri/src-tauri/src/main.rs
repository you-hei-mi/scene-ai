/**
 * BuildingAI Desktop 主入口文件
 *
 * 负责初始化 Tauri 应用、窗口管理、系统托盘和自动更新功能。
 */

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use tauri::{
  api::dialog::message,
  Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};

#[derive(Clone, Serialize)]
struct Payload {
  message: String,
}

/**
 * 创建系统托盘菜单
 */
fn create_tray_menu() -> SystemTrayMenu {
  SystemTrayMenu::new()
    .add_item(SystemTrayMenuItem::new(
      "打开主窗口",
      tauri::CustomMenuItem::new("show".to_string(), "打开主窗口"),
    ))
    .add_item(SystemTrayMenuItem::new(
      "最小化",
      tauri::CustomMenuItem::new("hide".to_string(), "最小化"),
    ))
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(SystemTrayMenuItem::new(
      "检查更新",
      tauri::CustomMenuItem::new("check_update".to_string(), "检查更新"),
    ))
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(SystemTrayMenuItem::new(
      "退出",
      tauri::CustomMenuItem::new("quit".to_string(), "退出"),
    ))
}

/**
 * 处理系统托盘事件
 */
fn handle_tray_event(app: &tauri::AppHandle, event: SystemTrayEvent) {
  match event {
    SystemTrayEvent::LeftClick { position: _, size: _, .. } => {
      // 左键点击显示/隐藏窗口
      let window = app.get_window("main").unwrap();
      if window.is_visible().unwrap_or(false) {
        window.hide().unwrap();
      } else {
        window.show().unwrap();
        window.set_focus().unwrap();
      }
    }
    SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
      "show" => {
        let window = app.get_window("main").unwrap();
        window.show().unwrap();
        window.set_focus().unwrap();
      }
      "hide" => {
        let window = app.get_window("main").unwrap();
        window.hide().unwrap();
      }
      "check_update" => {
        // 触发自动更新检查
        tauri::updater::check_update(app).unwrap();
      }
      "quit" => {
        app.exit(0);
      }
      _ => {}
    },
    _ => {}
  }
}

/**
 * 主函数 - Tauri 应用入口
 */
fn main() {
  let tray = SystemTray::new()
    .with_menu(create_tray_menu())
    .on_event(handle_tray_event);

  tauri::Builder::default()
    .system_tray(tray)
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .setup(|app| {
      // 创建主窗口
      let window = app.get_window("main").unwrap();

      // 设置窗口初始状态（从插件恢复）
      let _ = tauri_plugin_window_state::on_window_event(&window);

      // 注册更新事件监听
      app.listen_global("tauri://update-available", |event| {
        let payload = event.payload().unwrap_or("");
        println!("更新可用: {}", payload);
        message(
          Some(&app.get_window("main").unwrap()),
          "更新可用",
          "发现新版本，是否立即更新？",
        );
      });

      app.listen_global("tauri://update-download-progress", |event| {
        let payload = event.payload().unwrap_or("");
        println!("更新进度: {}", payload);
      });

      app.listen_global("tauri://update-install", |event| {
        let payload = event.payload().unwrap_or("");
        println!("开始安装更新: {}", payload);
      });

      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      get_version,
      get_app_data_dir,
      open_file_dialog,
      save_file_dialog,
      select_folder_dialog,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

/**
 * 获取应用版本号
 */
#[tauri::command]
fn get_version() -> String {
  env!("CARGO_PKG_VERSION").to_string()
}

/**
 * 获取应用数据目录
 */
#[tauri::command]
fn get_app_data_dir(app_handle: tauri::AppHandle) -> String {
  app_handle.path_resolver().app_data_dir().unwrap().to_str().unwrap().to_string()
}

/**
 * 打开文件选择对话框
 */
#[tauri::command]
fn open_file_dialog(window: tauri::Window, filters: Vec<String>) -> Option<String> {
  let dialog_filters: Vec<tauri::api::dialog::Filter> = filters
    .into_iter()
    .map(|f| tauri::api::dialog::Filter::new(&f))
    .collect();

  tauri::api::dialog::FileDialogBuilder::new()
    .add_filters(dialog_filters)
    .pick_file(&window)
    .map(|p| p.to_str().unwrap().to_string())
}

/**
 * 打开保存文件对话框
 */
#[tauri::command]
fn save_file_dialog(window: tauri::Window, default_filename: String) -> Option<String> {
  tauri::api::dialog::FileDialogBuilder::new()
    .set_file_name(&default_filename)
    .save_file(&window)
    .map(|p| p.to_str().unwrap().to_string())
}

/**
 * 打开文件夹选择对话框
 */
#[tauri::command]
fn select_folder_dialog(window: tauri::Window) -> Option<String> {
  tauri::api::dialog::FileDialogBuilder::new()
    .pick_folder(&window)
    .map(|p| p.to_str().unwrap().to_string())
}
