import { BaseController } from "@buildingai/base";
import { ExtensionWebController } from "@buildingai/core/decorators";
import { Body, Get, Post } from "@nestjs/common";

import { StudioService } from "../studio.service";

@ExtensionWebController("tasks")
export class TaskWebController extends BaseController {
    constructor(private readonly studioService: StudioService) {
        super();
    }

    @Get()
    list() {
        return this.studioService.listTasks();
    }

    @Post()
    create(@Body() payload: Record<string, unknown>) {
        return this.studioService.createTask(payload);
    }
}
