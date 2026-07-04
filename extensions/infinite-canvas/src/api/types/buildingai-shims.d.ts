declare module "@buildingai/base" {
    export class BaseController {}
    export class BaseService {}
}

declare module "@buildingai/core/decorators" {
    export function ExtensionEntity(options?: unknown): ClassDecorator;
    export function ExtensionWebController(path?: string, title?: string): ClassDecorator;
    export function ExtensionConsoleController(path?: string, title?: string): ClassDecorator;
}

declare module "@buildingai/db/@nestjs/typeorm" {
    export function InjectRepository(entity: unknown): ParameterDecorator & PropertyDecorator;
    export const TypeOrmModule: {
        forFeature(entities: unknown[]): any;
    };
}

declare module "@buildingai/db/typeorm" {
    export interface Repository<T> {
        find(options?: unknown): Promise<T[]>;
        findOne(options?: unknown): Promise<T | null>;
        create(payload?: Partial<T> | Record<string, unknown>): T;
        save(entity: T): Promise<T>;
        delete(id: string): Promise<unknown>;
    }
}

declare module "@buildingai/errors" {
    export const HttpErrorFactory: {
        badRequest(message?: string): Error;
        notFound(message?: string): Error;
    };
}
