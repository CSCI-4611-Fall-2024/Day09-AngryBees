import * as gfx from 'gophergfx'

/** This class is similar to the Arrow class used in AngryVectors, but there are a
 * few interesting differences:
 * - Bee's position and velocity are updated with acceleration due to gravity and equations of motion
 * - Bee's geometry is composed of four spheres that have been transformed and colored to create a bee
 */
export class Bee extends gfx.Node3
{
    // Starting position before the bee is launched.
    initalPosition = new gfx.Vector3(-30, 6, -35);
    //initalPosition = new gfx.Vector3(0, 0, 0);

    // The bee is oriented along its velocity vector unless its velocity is (0,0,0) in which case it is
    // oriented to face in the defaultHeading direction.
    defaultHeading = new gfx.Vector3(1, 0, 0);
    //defaultHeading = new gfx.Vector3(0, 0, -1);

    // Uniform scale factor to apply to the bee geometry, defaults to 1.0
    size = 1;

    // Current velocity of the bee; initialized to 0,0,0
    velocity = new gfx.Vector3(0, 0, 0);

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
        // NOTE: Here, Matrix4s are used to create a bee character out of spheres that are
        // translated, rotated, and scaled.  These Matrix4s are calculated just once at startup.
        const beeBody = gfx.Geometry3Factory.createSphere(2);
        const S = gfx.Matrix4.makeScale(new gfx.Vector3(0.5, 0.5, 0.8));
        beeBody.setLocalToParentMatrix(S, false);
        beeBody.material.setColor(new gfx.Color(1, 0.82, 0));
        this.add(beeBody);

        // head:   T(0, .1, -.8) * S(.4)
        const beeHead = gfx.Geometry3Factory.createSphere(2);
        const Shead = gfx.Matrix4.makeScale(new gfx.Vector3(0.4, 0.4, 0.4));
        const Thead = gfx.Matrix4.makeTranslation(new gfx.Vector3(0, 0.1, -0.8));
        const headCombo = gfx.Matrix4.multiplyAll(Thead, Shead);
        beeHead.setLocalToParentMatrix(headCombo, false);
        beeHead.material.setColor(new gfx.Color(0, 0, 0));
        this.add(beeHead);


        // left wing:  T(-.55, .8, .5) * Ry(-Math.PI/8) * Rx(-Math.PI/8) * S(.2, .05, .8) 
        const beeLWing = gfx.Geometry3Factory.createSphere(2);
        const lWingS = gfx.Matrix4.makeScale(new gfx.Vector3(.2, .05, .8));
        const lWingRx = gfx.Matrix4.makeRotationX(-Math.PI/8);
        const lWingRy = gfx.Matrix4.makeRotationY(-Math.PI/8);
        const lWingT = gfx.Matrix4.makeTranslation(new gfx.Vector3(-.55, .8, .5));
        const lWingCombo = gfx.Matrix4.multiplyAll(lWingT, lWingRy, lWingRx, lWingS);
        beeLWing.setLocalToParentMatrix(lWingCombo, false);
        beeLWing.material.setColor(new gfx.Color(1, 1, 1));
        this.add(beeLWing);

        // right wing:  T(.55, .8, .5) * Ry(Math.PI/8) * Rx(-Math.PI/8) * S(.2, .05, .8)   

    }


    public reset() {
        this.position = this.initalPosition;
        this.velocity = gfx.Vector3.ZERO;
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

        // NOTE: Here, Matrix4s are used to set the bee's position, orientation, and
        // scale in the scene. These Matrix4s change every frame as the bee moves!
        const T = gfx.Matrix4.makeTranslation(this.position);
        const R = gfx.Matrix4.lookAt(new gfx.Vector3(0,0,0), heading, new gfx.Vector3(0,1,0));
        const S = gfx.Matrix4.makeScale(new gfx.Vector3(this.size, this.size, this.size));
        this.setLocalToParentMatrix(gfx.Matrix4.multiplyAll(T, R, S), false);
    }
}
