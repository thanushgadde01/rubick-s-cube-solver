declare module "cubejs" {
  export interface CubeStateJSON {
    center: number[];
    cp: number[];
    co: number[];
    ep: number[];
    eo: number[];
  }

  export default class Cube {
    constructor(state?: Cube | CubeStateJSON | string);
    init(state: Cube | CubeStateJSON | string): void;
    identity(): void;
    toJSON(): CubeStateJSON;
    asString(): string;
    clone(): Cube;
    isSolved(): boolean;
    move(algorithm: string): void;
    randomize(): void;
    solve(): string;
    solveUpright(): string;
    upright(): Cube;
    static initSolver(): void;
    static random(): Cube;
    static scramble(): string;
    static fromString(str: string): Cube;
  }
}
