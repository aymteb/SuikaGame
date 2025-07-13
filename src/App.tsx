import {
  Bodies,
  Body,
  Engine,
  Render,
  Runner,
  Sleeping,
  World,
  Events,
} from "matter-js";
import { useEffect, useRef } from "react";
import { AddCurentFruit } from "./AddCurentFruit";
import { Fruits } from "./Fruits";

function App() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const fruitRef = useRef<Body | null>(null);
  const intervalRef = useRef<number | null>(null);
  const disabledRef = useRef(false);

  useEffect(() => {
    const engine = Engine.create();
    engineRef.current = engine;
    const render = Render.create({
      element: sceneRef.current || document.body,
      engine: engine,
      options: {
        width: 620,
        height: 850,
        wireframes: false,
        background: "#F7F4C8",
      },
    });
    renderRef.current = render;

    const ground = Bodies.rectangle(310, 820, 620, 60, {
      isStatic: true,
      render: {
        fillStyle: "#E6B143",
      },
    });

    const fruit = AddCurentFruit();
    fruitRef.current = fruit;

    const leftWall = Bodies.rectangle(15, 395, 30, 790, {
      isStatic: true,
      render: {
        fillStyle: "#E6B143",
      },
    });

    const rightWall = Bodies.rectangle(605, 395, 30, 790, {
      isStatic: true,
      render: {
        fillStyle: "#E6B143",
      },
    });

    const topLine = Bodies.rectangle(310, 150, 620, 2, {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: "#E6B143",
      },
      label: "topLine",
    });

    World.add(engine.world, [ground, leftWall, rightWall, fruit, topLine]);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!fruitRef.current) return;
      if (intervalRef.current) return;
      if (disabledRef.current) return;

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        intervalRef.current = setInterval(() => {
          if (!fruitRef.current) return;
          const fruitRadius = fruitRef.current.circleRadius || 20;
          if (event.key === "ArrowLeft") {
            if (fruitRef.current.position.x - fruitRadius > 30) {
              Body.setPosition(fruitRef.current, {
                x: fruitRef.current.position.x - 1,
                y: fruitRef.current.position.y,
              });
            }
          }
          if (event.key === "ArrowRight") {
            if (fruitRef.current.position.x + fruitRadius < 590) {
              Body.setPosition(fruitRef.current, {
                x: fruitRef.current.position.x + 1,
                y: fruitRef.current.position.y,
              });
            }
          }
        }, 5);
      }

      if (event.code === "Space") {
        disabledRef.current = true;
        Sleeping.set(fruitRef.current, false);
        const newFruit = AddCurentFruit();
        fruitRef.current = newFruit;
        setTimeout(() => {
          World.add(engineRef.current!.world, newFruit);
          disabledRef.current = false;
        }, 1000);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    Render.run(render);
    Runner.run(Runner.create(), engine);

    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((collision) => {
        if (collision.bodyA.label === collision.bodyB.label) {
          World.remove(engine.world, [collision.bodyA, collision.bodyB]);
          const index = Fruits.findIndex(
            (fruit) => fruit.name === collision.bodyA.label
          );

          if (index === Fruits.length - 1) {
            return;
          }

          const newFruit = Fruits[index + 1];
          const newFruitBody = Bodies.circle(
            collision.collision.supports[0].x,
            collision.collision.supports[0].y,
            newFruit.radius,
            {
              render: {
                fillStyle: newFruit.color,
                sprite: {
                  texture: `Images/${newFruit.name}.png`,
                  xScale: 1,
                  yScale: 1,
                },
              },
              label: newFruit.name,
            }
          );
          World.add(engine.world, newFruitBody);
        }

        if (
          (collision.bodyA.label === "topLine" ||
            collision.bodyB.label === "topLine") &&
          !disabledRef.current
        ) {
          alert("Game Over");
        }
      });
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      Render.stop(render);
      Engine.clear(engine);
      if (render.canvas.parentNode) {
        render.canvas.parentNode.removeChild(render.canvas);
      }
    };
  }, []);

  return <div ref={sceneRef} />;
}

export default App;
