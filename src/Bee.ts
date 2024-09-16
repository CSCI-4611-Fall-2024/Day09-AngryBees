import * as gfx from 'gophergfx'

/** This class is similar to the Arrow class used in AngryVectors, but there are a
 * few interesting differences:
 * - Bee's position and velocity are updated with acceleration due to gravity and equations of motion
 * - Bee's geometry is composed of four spheres that have been transformed and colored to create a bee
 */
export class Bee extends gfx.Node3
{
    // The bee is oriented along its velocity unless it equals (0,0,0) in which case it is
    // oriented to face in the defaultHeading direction.
    private _defaultHeading = new gfx.Vector3(1, 0, 0);
    // Uniform scale factor to apply to the bee geometry, defaults to 1.0
    private _size = 1;
    // Current velocity of the bee; initialized to 0,0,0
    private _velocity = new gfx.Vector3(0, 0, 0);


    public get defaultHeading() {
        return this._defaultHeading;
    }

    public set defaultHeading(value: gfx.Vector3) {
        this._defaultHeading = value;
    }

    public get size() {
        return this._size;
    }

    public set size(value: number) {
        this._size = value;
    }

    public get velocity() {
        return this._velocity;
    }

    public set velocity(value: gfx.Vector3) {
        this._velocity = value;
    }

    // The size parameter is optional.  It can be used to set a uniform scale factor for
    // the bee geometry to make the bee larger or smaller.  Default = 1.0, i.e., no scaling.
    constructor(size?: number)
    {
        super();

        // In typescript, this is how to test whether the size parameter was provided to the
        // constructor or not.  If size was provided, then its type will be "number", otherwise
        // its type will be "undefined".
        if (typeof size == "number") {
            this.size = size;
        }

        // TODO: Let's make this Bee look like a bee!
        const beeBody = gfx.Geometry3Factory.createSphere(2);
        this.add(beeBody);

    }

    public update(deltaTime: number) {
        // TODO: Make sure you understand everything that is happening in this function!

        // The default heading is used only in the case when the bee's velocity = (0,0,0).
        let heading = this.defaultHeading;
        if (this.velocity.length() != 0) {
            const a = new gfx.Vector3(0, -10, 0);
            this.velocity.add(gfx.Vector3.multiplyScalar(a, deltaTime));
            this.position.add(gfx.Vector3.multiplyScalar(this.velocity, deltaTime));
            heading = gfx.Vector3.normalize(this.velocity);
        }

        this.setLocalToParentMatrix(gfx.Matrix4.IDENTITY, false);
    }
}
