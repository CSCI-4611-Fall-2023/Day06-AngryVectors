/** CSci-4611 Example Code
 * Copyright 2023+ Regents of the University of Minnesota
 * Please do not distribute beyond the CSci-4611 course
 */

import * as gfx from 'gophergfx'
import {Arrow} from './Arrow'

export class ExampleApp extends gfx.GfxApp
{   
    private simulationTime = 0;
    private bird = new gfx.Mesh3();
    private birdRadius = 2;
    private targetSize = new gfx.Vector3(3, 12, 20);
    private targets: gfx.Mesh3[] = [];
    private target1Pos = new gfx.Vector3(21, 6, -35);
    private target2Pos = new gfx.Vector3(25, 6, -35);
    private target3Pos = new gfx.Vector3(23, 18, -35);


    private arrow: Arrow = new Arrow();

    // --- Create the ExampleApp class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();
    }

    calcBirdPos(t: number): gfx.Vector3 {
        const e = t / 4.0;
        const x = e * 52.0 - 30.0;
        const y = 30.0 * (-e * e + 1.2 * e) + 5.0;
        const z = -35.0;
        return new gfx.Vector3(x, y, z);
    }

    calcBirdVel(t: number): gfx.Vector3 {
        return gfx.Vector3.subtract(this.calcBirdPos(t + 0.5), this.calcBirdPos(t - 0.5));
    }

    // --- Initialize the graphics scene ---
    createScene(): void
    {
        this.renderer.background = new gfx.Color(0.2, 0.6, 1.0);

        // Setup a camera
        this.camera.setPerspectiveCamera(60, 4/3, 0.01, 100.0);
        this.camera.position = new gfx.Vector3(0, 8, 10);
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
        ground.position = new gfx.Vector3(0, -2, -50);
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

        // bird
        this.bird = gfx.Geometry3Factory.createSphere(this.birdRadius);
        this.scene.add(this.bird);
        this.bird.position = this.calcBirdPos(this.simulationTime);
        this.bird.material.setColor(gfx.Color.RED);

        // arrow
        this.arrow = new Arrow(gfx.Color.YELLOW);
        this.scene.add(this.arrow);
    }


    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
        this.simulationTime += deltaTime;
        if (this.simulationTime > 6) {
            this.simulationTime = 0;
            this.targets.forEach((target) => {
                target.visible = true;
            });
        }
        this.bird.position = this.calcBirdPos(this.simulationTime);

        this.arrow.position = this.bird.position;
        this.arrow.vector = this.calcBirdVel(this.simulationTime);

        this.targets.forEach((target) => {
            if (this.sphereIntersectsBox(this.bird.position, this.birdRadius, target.position, this.targetSize)) {
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

        if (((spherePos.x + sphereRad >= xMin) && (spherePos.x - sphereRad <= xMax)) && 
            ((spherePos.y + sphereRad >= yMin) && (spherePos.y - sphereRad <= yMax)) &&
            ((spherePos.z + sphereRad >= zMin) && (spherePos.z - sphereRad <= zMax))) {
            return true;
        } else {
            return false;
        }
    }
}