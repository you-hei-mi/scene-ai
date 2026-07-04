import { ExtensionEntity } from "@buildingai/core/decorators";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ExtensionEntity()
export class WorkflowPreset {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 180 })
    name: string;

    @Column({ length: 40, default: "comfyui" })
    kind: "comfyui" | "runninghub" | "canvas";

    @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
    content: Record<string, unknown>;

    @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
    config: Record<string, unknown>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
