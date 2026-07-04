import { BaseController } from "@buildingai/base";
import { ExtensionWebController } from "@buildingai/core/decorators";
import { Body, Get, Post } from "@nestjs/common";

import { StudioService } from "../studio.service";

@ExtensionWebController("workflows")
export class WorkflowWebController extends BaseController {
    constructor(private readonly studioService: StudioService) {
        super();
    }

    @Get()
    list() {
        return this.studioService.listWorkflows();
    }

    @Post()
    save(@Body() payload: Record<string, unknown>) {
        return this.studioService.saveWorkflow(payload);
    }
}
