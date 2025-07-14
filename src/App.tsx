import {
  Bodies,
  Body,
  Engine,
  Events,
  Render,
  Runner,
  Sleeping,
  World,
} from "matter-js";
import { useEffect, useRef, useState } from "react";
import { AddCurentFruit } from "./AddCurentFruit";
import { Fruits } from "./Fruits";
import { addScore, getBestScores } from "./ScoreStorage";

function App() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const renderRef = useRef<Render | null>(null);
  const fruitRef = useRef<Body | null>(null);
  const intervalRef = useRef<number | null>(null);
  const disabledRef = useRef(false);
  const [score, setScore] = useState(0);
  const [bestScores, setBestScores] = useState<
    { pseudo: string; score: number }[]
  >(getBestScores());
  const scoreRef = useRef(0);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

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

          setScore((prevScore) => prevScore + Fruits[index].points);

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
          const bestScores = getBestScores();
          const minScore =
            bestScores.length < 5 ? 0 : bestScores[bestScores.length - 1].score;
          if (scoreRef.current > minScore || bestScores.length < 5) {
            const pseudo =
              prompt(
                "Bravo ! Tu entres dans le top 5 ! Entre ton pseudo (8 caractères max) :"
              )?.slice(0, 8) || "Anonyme";
            const updatedScores = addScore({ pseudo, score: scoreRef.current });
            setBestScores(updatedScores);
            alert("Félicitations, tu es dans le classement !");
          } else {
            alert("Game Over");
          }
          resetGame();
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

  const resetGame = () => {
    setScore(0);

    const world = engineRef.current?.world;
    if (world) {
      const staticBodies = world.bodies.filter((body) => body.isStatic);
      World.clear(world, false);
      staticBodies.forEach((body) => World.add(world, body));
    }

    const fruit = AddCurentFruit();
    fruitRef.current = fruit;
    if (engineRef.current) {
      World.add(engineRef.current.world, fruit);
    }
  };

  return (
    <div style={{ position: "relative", width: "620px", margin: "0 auto" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "-40%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
          color: "white",
          padding: "10px 20px",
          borderRadius: "25px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          fontSize: "24px",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          border: "3px solid #FFD93D",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          minWidth: "120px",
          textAlign: "center",
        }}
      >
        🏆 Score: {score}
      </div>

      <div
        style={{
          position: "absolute",
          top: "58%",
          left: "-40%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "linear-gradient(135deg, #FF8E53, #FFD93D)",
          color: "#fff",
          padding: "10px 24px",
          borderRadius: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          fontSize: "18px",
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          border: "2px solid #FFD93D",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
          minWidth: "120px",
          textAlign: "center",
          cursor: "pointer",
          outline: "none",
        }}
        onClick={resetGame}
      >
        🔄 Recommencer
      </div>

      <div
        style={{
          position: "absolute",
          top: "400px",
          right: "-350px",
          width: "200px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
          padding: "20px",
          textAlign: "center",
          border: "2px solid #FFD93D",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h3 style={{ margin: 0, marginBottom: 10 }}>🏅 Meilleurs scores</h3>
        {bestScores.length === 0 ? (
          <div style={{ color: "#888" }}>
            Pas encore d'historique de score,
            <br />
            fais un bon score pour figurer en haut du classement !
          </div>
        ) : (
          <ol style={{ paddingLeft: 20, margin: 0 }}>
            {bestScores.map((entry, i) => (
              <li key={i} style={{ fontWeight: "bold", fontSize: 18 }}>
                {entry.pseudo} — {entry.score}
              </li>
            ))}
          </ol>
        )}
      </div>

      <div ref={sceneRef} />
    </div>
  );
}

export default App;
