import { BaseController } from "@buildingai/base";
import { ExtensionConsoleController } from "@buildingai/core/decorators";
import { Get } from "@nestjs/common";

@ExtensionConsoleController("studio", "Infinite Canvas Management")
export class StudioConsoleController extends BaseController {
    @Get("summary")
    summary() {
        return {
            name: "Infinite Canvas",
            version: "0.1.0",
            capabilities: ["canvas", "assets", "prompts", "providers", "workflows", "tasks"],
        };
    }
}
