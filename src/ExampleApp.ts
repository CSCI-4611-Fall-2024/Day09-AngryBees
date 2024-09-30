/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'
import {Arrow} from './Arrow'
import {Bee} from './Bee'

export class ExampleApp extends gfx.GfxApp
{   
    private arrow = new Arrow();
    private bee = new Bee();
    private targetSize = new gfx.Vector3(3, 12, 20);
    private targets: gfx.Mesh3[] = [];
    private target1Pos = new gfx.Vector3(21, 6, -35);
    private target2Pos = new gfx.Vector3(25, 6, -35);
    private target3Pos = new gfx.Vector3(23, 18, -35);
    private mouseStart = new gfx.Vector2();

    
    // --- Create the ExampleApp class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();
    }


    // --- Initialize the graphics scene ---
    createScene(): void
    {
        this.renderer.background = new gfx.Color(0.2, 0.6, 1.0);

        // Setup a camera
        this.camera.setPerspectiveCamera(60, 4/3, 0.01, 100.0);
        this.camera.position = new gfx.Vector3(0, 8, 20);
        this.camera.lookAt(new gfx.Vector3(0, 8, 0), gfx.Vector3.UP);

        // Create some lights
        const ambientLight = new gfx.AmbientLight(new gfx.Color(0.25, 0.25, 0.25));
        this.scene.add(ambientLight);
        const pointLight = new gfx.PointLight(new gfx.Color(0.6, 0.6, 0.6));
        this.scene.add(pointLight);
        pointLight.position = new gfx.Vector3(10, 10, 10);

        // show xyz axes lines at the origin (can be useful for debugging)
        const axes = gfx.Geometry3Factory.createAxes(1);
        this.scene.add(axes);

        // ground
        const ground = gfx.Geometry3Factory.createBox(160, 4, 200);
        this.scene.add(ground);
        ground.position = new gfx.Vector3(0, -4, -50);
        ground.material.setColor(new gfx.Color(0.3, 0.9, 0.4));

        // 3 targets
        const target1 = gfx.Geometry3Factory.createBox(
            this.targetSize.x, this.targetSize.y, this.targetSize.z);
        this.scene.add(target1);
        target1.position = this.target1Pos;
        target1.material.setColor(new gfx.Color(0.6, 0.4, 0.2));
        this.targets.push(target1);

        const target2 = gfx.Geometry3Factory.createBox(
            this.targetSize.x, this.targetSize.y, this.targetSize.z);
        this.scene.add(target2);
        target2.position = this.target2Pos;
        target2.material.setColor(new gfx.Color(0.6, 0.4, 0.2));
        this.targets.push(target2);

        const target3 = gfx.Geometry3Factory.createBox(
            this.targetSize.x, this.targetSize.y, this.targetSize.z);
        this.scene.add(target3);
        target3.position = this.target3Pos;
        target3.material.setColor(new gfx.Color(0.6, 0.4, 0.2));
        this.targets.push(target3);

        // launcher
        const launcher = gfx.Geometry3Factory.createCylinder(50, 1, 7);
        this.scene.add(launcher);
        launcher.position = new gfx.Vector3(-30, 1.5, -35);
        launcher.material.setColor(new gfx.Color(0, 0, 0));

        // bee
        this.scene.add(this.bee);

        // arrow
        this.arrow = new Arrow(gfx.Color.YELLOW);
        this.scene.add(this.arrow);

        this.reset();
    }


    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
        if (this.bee.position.y < 0) {
            this.reset();
        }

        this.bee.update(deltaTime);

        this.targets.forEach((target) => {
            if (this.sphereIntersectsBox(this.bee.position, this.bee.size, target.position, this.targetSize)) {
                target.visible = false;
            }
        });
    }

    sphereIntersectsBox(spherePos: gfx.Vector3, sphereRad: number, boxPos: gfx.Vector3, boxSize: gfx.Vector3): boolean
    {
        const xMin = boxPos.x - boxSize.x/2;
        const xMax = boxPos.x + boxSize.x/2;
        const yMin = boxPos.y - boxSize.y/2;
        const yMax = boxPos.y + boxSize.y/2;
        const zMin = boxPos.z - boxSize.z/2;
        const zMax = boxPos.z + boxSize.z/2;

        if (((spherePos.x >= xMin - sphereRad) && (spherePos.x <= xMax + sphereRad )) && 
            ((spherePos.y >= yMin - sphereRad) && (spherePos.y <= yMax + sphereRad)) &&
            ((spherePos.z >= zMin - sphereRad) && (spherePos.z <= zMax + sphereRad))) {
            return true;
        } else {
            return false;
        }
    }

    reset(): void
    {
        this.bee.reset();
        this.arrow.position = this.bee.initalPosition;
        this.arrow.vector = gfx.Vector3.ZERO;
        this.targets.forEach((target) => {
            target.visible = true;
        });
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key == " ") {
            this.reset();
        }
    }

    onMouseDown(event: MouseEvent): void 
    {
        // Left mouse button
        if (event.button == 0) {
            this.reset();
            this.mouseStart = this.getNormalizedDeviceCoordinates(event.x, event.y);
            this.arrow.visible = true;
        }
    }

    onMouseMove(event: MouseEvent): void 
    {
        if (event.buttons == 1) {
            const mouseEnd = this.getNormalizedDeviceCoordinates(event.x, event.y);
            const mouseVec = gfx.Vector2.subtract(mouseEnd, this.mouseStart);
            this.arrow.vector = new gfx.Vector3(10 * mouseVec.x, 10 * mouseVec.y, 0);
            this.bee.defaultHeading = this.arrow.vector;
        }
    }

    onMouseUp(event: MouseEvent): void
    {
        if (event.button == 0) {
            this.arrow.visible = false;
            this.bee.velocity = this.arrow.vector;
            this.bee.velocity.multiplyScalar(3);
            this.bee.defaultHeading = gfx.Vector3.RIGHT;
        }
    }
}
