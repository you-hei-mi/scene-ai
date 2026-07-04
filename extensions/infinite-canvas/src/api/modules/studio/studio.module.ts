import { TypeOrmModule } from "@buildingai/db/@nestjs/typeorm";
import { Module } from "@nestjs/common";

import {
    AiProviderProfile,
    AssetCategory,
    AssetItem,
    AssetLibrary,
    Canvas,
    CanvasProject,
    GenerationTask,
    PromptCategory,
    PromptItem,
    PromptLibrary,
    WorkflowPreset,
} from "../../db/entities";
import { AssetWebController } from "./controllers/asset.web.controller";
import { ActionsWebController } from "./controllers/actions.web.controller";
import { CanvasWebController } from "./controllers/canvas.web.controller";
import { ProjectWebController } from "./controllers/project.web.controller";
import { PromptWebController } from "./controllers/prompt.web.controller";
import { ProviderWebController } from "./controllers/provider.web.controller";
import { StudioConsoleController } from "./controllers/studio.console.controller";
import { TaskWebController } from "./controllers/task.web.controller";
import { WorkflowWebController } from "./controllers/workflow.web.controller";
import { ConversationWebController } from "./controllers/conversation.web.controller";
import { StudioService } from "./studio.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AiProviderProfile,
            AssetCategory,
            AssetItem,
            AssetLibrary,
            Canvas,
            CanvasProject,
            GenerationTask,
            PromptCategory,
            PromptItem,
            PromptLibrary,
            WorkflowPreset,
        ]),
    ],
    controllers: [
        AssetWebController,
        ActionsWebController,
        CanvasWebController,
        ProjectWebController,
        PromptWebController,
        ProviderWebController,
        StudioConsoleController,
        TaskWebController,
        WorkflowWebController,
    ],
    providers: [StudioService],
    exports: [StudioService],
})
export class StudioModule {}
