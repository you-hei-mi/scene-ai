import { ExtensionEntity } from "@buildingai/core/decorators";
import { Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Canvas } from "./canvas.entity";

@ExtensionEntity()
export class CanvasProject {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 120, comment: "Project name" })
    name: string;

    @Column({ length: 80, default: "layers", comment: "Lucide icon name" })
    icon: string;

    @Column({ length: 32, default: "#2563eb", comment: "Project color" })
    color: string;

    @Column({ type: "int", default: 0, comment: "Sort order" })
    sort: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Canvas, (canvas) => canvas.project)
    canvases?: Canvas[];
}
