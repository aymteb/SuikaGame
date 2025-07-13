import { Bodies, Body } from "matter-js";
import { Fruits } from "./Fruits";

let previousFruitName: string | null = null;

export const AddCurentFruit = (): Body => {
  const randomFruit = Fruits[Math.floor(Math.random() * 5)];

  if (previousFruitName && previousFruitName === randomFruit.name) {
    return AddCurentFruit();
  }

  const fruit = Bodies.circle(300, 30, randomFruit.radius, {
    label: randomFruit.name,
    isSleeping: true,
    render: {
      fillStyle: randomFruit.color,
      sprite: {
        texture: `Images/${randomFruit.name}.png`,
        xScale: 1,
        yScale: 1
      },
    },
  });

  previousFruitName = randomFruit.name;
  return fruit;
};
