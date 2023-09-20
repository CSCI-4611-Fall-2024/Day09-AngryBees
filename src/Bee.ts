import * as gfx from 'gophergfx'

/** 
 */
export class Bee extends gfx.Node3
{
    private _defaultHeading = gfx.Vector3.RIGHT;
    private _size = 1;
    private _velocity = gfx.Vector3.ZERO;

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

    static mul(lhs: gfx.Matrix4, rhs: gfx.Matrix4, ...additionalRHS: gfx.Matrix4[]): gfx.Matrix4
    {
        let result = gfx.Matrix4.multiply(lhs, rhs);
        if (additionalRHS.length > 0) {
            for (let i=0; i<additionalRHS.length; i++) {
                result = gfx.Matrix4.multiply(result, additionalRHS[i]);
            }
        }
        return result;
    }

    constructor(size?: number)
    {
        super();

        if (typeof size == "number") {
            this.size = size;
        }

        const beeBody = gfx.Geometry3Factory.createSphere(2);
        const sBody = gfx.Matrix4.makeScale(new gfx.Vector3(.5, .5, .8));
        beeBody.setLocalToParentMatrix(sBody, false);
        beeBody.material.setColor(new gfx.Color(1, 0.82, 0));
        this.add(beeBody);

        const beeHead = gfx.Geometry3Factory.createSphere(2);
        const tHead = gfx.Matrix4.makeTranslation(new gfx.Vector3(0, .1, -.8));
        const sHead = gfx.Matrix4.makeScale(new gfx.Vector3(.4, .4, .4));
        const totalHead = gfx.Matrix4.multiply(tHead, sHead);
        beeHead.setLocalToParentMatrix(totalHead, false);
        beeHead.material.setColor(new gfx.Color(0.2, 0.2, 0.2));
        this.add(beeHead);

        const beeLeftWing = gfx.Geometry3Factory.createSphere(2);
        const tLeftWing = gfx.Matrix4.makeTranslation(new gfx.Vector3(-.55, .8, .5));
        const sWings = gfx.Matrix4.makeScale(new gfx.Vector3(.2, .05, .8));
        const pitchWings = gfx.Matrix4.makeRotationX(-Math.PI/8);
        const rollLeftWing = gfx.Matrix4.makeRotationY(-Math.PI/8);
        const totalLeftWing = Bee.mul(tLeftWing, rollLeftWing, pitchWings, sWings);
        beeLeftWing.setLocalToParentMatrix(totalLeftWing, false);
        beeLeftWing.material = new gfx.UnlitMaterial();
        beeLeftWing.material.setColor(gfx.Color.WHITE);
        this.add(beeLeftWing);
        
        const beeRightWing = gfx.Geometry3Factory.createSphere(2);
        const tRightWing = gfx.Matrix4.makeTranslation(new gfx.Vector3(.55, .8, .5));
        const rollRightWing = gfx.Matrix4.makeRotationY(Math.PI/8);
        const totalRightWing = Bee.mul(tRightWing, rollRightWing, pitchWings, sWings);
        beeRightWing.setLocalToParentMatrix(totalRightWing, false);
        beeRightWing.material = new gfx.UnlitMaterial();
        beeRightWing.material.setColor(gfx.Color.WHITE);
        this.add(beeRightWing);
    }

    public update(deltaTime: number) {
        let heading = this.defaultHeading;
        if (this.velocity.length() != 0) {
            const a = new gfx.Vector3(0, -10, 0);
            this.velocity.add(gfx.Vector3.multiplyScalar(a, deltaTime));
            this.position.add(gfx.Vector3.multiplyScalar(this.velocity, deltaTime));
            heading = gfx.Vector3.normalize(this.velocity);
        }

        const T = gfx.Matrix4.makeTranslation(this.position);
        const R = gfx.Matrix4.lookAt(gfx.Vector3.ZERO, heading, gfx.Vector3.UP);
        const S = gfx.Matrix4.makeScale(new gfx.Vector3(this.size, this.size, this.size));
        this.setLocalToParentMatrix(Bee.mul(T, R, S), false);
    }
}
