import { BaseController } from "@buildingai/base";
import { ExtensionWebController } from "@buildingai/core/decorators";
import { Body, Get, Post } from "@nestjs/common";

import { StudioService } from "../studio.service";

@ExtensionWebController("providers")
export class ProviderWebController extends BaseController {
    constructor(private readonly studioService: StudioService) {
        super();
    }

    @Get()
    list() {
        return this.studioService.listProviders();
    }

    @Post()
    save(@Body() payload: Record<string, unknown>) {
        return this.studioService.saveProvider(payload);
    }

    @Post("test-connection")
    testConnection(@Body() payload: Record<string, unknown>) {
        return this.studioService.testConnection(payload);
    }

    @Post("fetch-models")
    fetchModels(@Body() payload: Record<string, unknown>) {
        return this.studioService.fetchModels(payload);
    }
}
