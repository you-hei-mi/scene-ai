import { ExtensionEntity } from "@buildingai/core/decorators";
import {
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { CanvasProject } from "./canvas-project.entity";

export enum CanvasKind {
    CLASSIC = "classic",
    SMART = "smart",
}

@ExtensionEntity()
export class Canvas {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 160, comment: "Canvas title" })
    title: string;

    @Column({ type: "varchar", length: 24, default: CanvasKind.CLASSIC })
    kind: CanvasKind;

    @Column({ length: 80, default: "workflow", comment: "Lucide icon name" })
    icon: string;

    @Column({ length: 32, default: "#0ea5e9" })
    color: string;

    @Column({ type: "uuid", nullable: true })
    projectId?: string;

    @Column({ type: "int", default: 0 })
    boardX: number;

    @Column({ type: "int", default: 0 })
    boardY: number;

    @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
    nodes: unknown[];

    @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
    edges: unknown[];

    @Column({ type: "jsonb", default: () => "'{\"x\":0,\"y\":0,\"scale\":1}'::jsonb" })
    viewport: Record<string, unknown>;

    @Column({ type: "jsonb", default: () => "'{}'::jsonb" })
    settings: Record<string, unknown>;

    @Column({ type: "timestamp", nullable: true })
    deletedAt?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => CanvasProject, (project) => project.canvases, { nullable: true })
    @JoinColumn({ name: "projectId" })
    project?: CanvasProject;
}
