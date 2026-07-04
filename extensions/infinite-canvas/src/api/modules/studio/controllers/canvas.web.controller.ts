import { BaseController } from "@buildingai/base";
import { ExtensionWebController } from "@buildingai/core/decorators";
import { Body, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";

import { StudioService } from "../studio.service";

@ExtensionWebController("canvases")
export class CanvasWebController extends BaseController {
    constructor(private readonly studioService: StudioService) {
        super();
    }

    @Get()
    list(@Query("includeDeleted") includeDeleted?: string) {
        return this.studioService.listCanvases(includeDeleted === "true");
    }

    @Post()
    create(@Body() payload: Record<string, unknown>) {
        return this.studioService.createCanvas(payload);
    }

    @Get(":id")
    detail(@Param("id") id: string) {
        return this.studioService.getCanvas(id);
    }

    @Put(":id")
    save(@Param("id") id: string, @Body() payload: Record<string, unknown>) {
        return this.studioService.saveCanvas(id, payload);
    }

    @Get(":id/export")
    async export(@Param("id") id: string) {
        return this.studioService.exportCanvas(await this.studioService.getCanvas(id));
    }

    @Post("import")
    import(@Body() payload: Record<string, unknown>) {
        const canvas = (payload.canvas || payload) as Record<string, unknown>;
        return this.studioService.createCanvas(canvas);
    }

    @Delete(":id")
    trash(@Param("id") id: string) {
        return this.studioService.trashCanvas(id);
    }

    @Post(":id/restore")
    restore(@Param("id") id: string) {
        return this.studioService.restoreCanvas(id);
    }

    @Delete(":id/purge")
    purge(@Param("id") id: string) {
        return this.studioService.purgeCanvas(id);
    }
}
