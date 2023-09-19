import * as gfx from 'gophergfx'

/** 
 * Creates a scene graph Node3 to draw an arrow.  The base of the arrow is located
 * at Arrow.position and the length and direction of the arrow are based on
 * Arrow.vector.  Example:
 * ```
 *   const arrow = new Arrow(gfx.Color.YELLOW);
 *   this.scene.add(arrow);
 *   arrow.position = new gfx.Vector3(1, 0, 0);
 *   arrow.vector = new gfx.Vector3(1, 1, 1);
 * ```
 */
export class Arrow extends gfx.Node3
{
    private _vector: gfx.Vector3 = gfx.Vector3.UP;
    private shaft: gfx.Mesh3 = new gfx.Mesh3();
    private cone: gfx.Mesh3 = new gfx.Mesh3();

    constructor(color?: gfx.Color)
    {
        super();
        
        this.shaft = gfx.Geometry3Factory.createCylinder(10, 0.04, 0.75);
        this.shaft.position = new gfx.Vector3(0, 0.75/2, 0);
        this.add(this.shaft);

        this.cone = gfx.Geometry3Factory.createCone(0.1, 0.25);
        this.cone.position = new gfx.Vector3(0, 0.75 + 0.25/2, 0);
        this.add(this.cone);

        if (color instanceof gfx.Color) {
            this.setColor(color);
        }
        this.setVector(this.vector);
    }

    public get color() {
        return this.shaft.material.getColor();
    }

    public set color(value: gfx.Color) {
        this.setColor(value);
    }

    public get vector() {
        return this._vector;
    }

    public set vector(value: gfx.Vector3) {
        this.setVector(value);
    }

    public setColor(color: gfx.Color): void
    {
        this.shaft.material.setColor(gfx.Color.YELLOW);
        this.cone.material.setColor(gfx.Color.YELLOW);
    }

    public setVector(vector: gfx.Vector3): void
    {
        this._vector = vector;

        const len = this.vector.length();
        this.scale = new gfx.Vector3(len, len, len);

        const dir = gfx.Vector3.normalize(vector);
        const rotAxis = gfx.Vector3.cross(gfx.Vector3.UP, dir);
        const rotAngle = gfx.Vector3.angleBetween(gfx.Vector3.UP, dir);
        this.rotation = gfx.Quaternion.makeAxisAngle(rotAxis, rotAngle);
    }
}