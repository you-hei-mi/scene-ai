import { BaseController } from "@buildingai/base";
import { ExtensionWebController } from "@buildingai/core/decorators";
import { Body, Get, Post } from "@nestjs/common";

import { StudioService } from "../studio.service";

@ExtensionWebController("assets")
export class AssetWebController extends BaseController {
    constructor(private readonly studioService: StudioService) {
        super();
    }

    @Get("libraries")
    listLibraries() {
        return this.studioService.listAssetLibraries();
    }

    @Post("libraries")
    createLibrary(@Body() payload: Record<string, unknown>) {
        return this.studioService.createAssetLibrary(payload);
    }

    @Post("categories")
    createCategory(@Body() payload: Record<string, unknown>) {
        return this.studioService.createAssetCategory(payload);
    }

    @Post("items")
    createItem(@Body() payload: Record<string, unknown>) {
        return this.studioService.createAssetItem(payload);
    }
}
