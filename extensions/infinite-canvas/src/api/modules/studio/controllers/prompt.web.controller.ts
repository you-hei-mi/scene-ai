import { BaseController } from "@buildingai/base";
import { ExtensionWebController } from "@buildingai/core/decorators";
import { Body, Get, Post } from "@nestjs/common";

import { StudioService } from "../studio.service";

@ExtensionWebController("prompts")
export class PromptWebController extends BaseController {
    constructor(private readonly studioService: StudioService) {
        super();
    }

    @Get("libraries")
    listLibraries() {
        return this.studioService.listPromptLibraries();
    }

    @Post("libraries")
    createLibrary(@Body() payload: Record<string, unknown>) {
        return this.studioService.createPromptLibrary(payload);
    }

    @Post("categories")
    createCategory(@Body() payload: Record<string, unknown>) {
        return this.studioService.createPromptCategory(payload);
    }

    @Post("items")
    createItem(@Body() payload: Record<string, unknown>) {
        return this.studioService.createPromptItem(payload);
    }
}
