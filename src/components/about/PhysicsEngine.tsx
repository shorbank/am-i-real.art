import { useEffect } from "react";
import Matter from "matter-js";

export default function PhysicsEngine() {
  useEffect(() => {
    const { Engine, World, Bodies, Runner } = Matter;

    const engine = Engine.create();
    const world = engine.world;
    const runner = Runner.create();
    Runner.run(runner, engine);

    const elements = document.querySelectorAll<HTMLElement>(".matter-body");
    const bodies: { el: HTMLElement; body: Matter.Body }[] = [];

    elements.forEach((el) => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      const isCircle = el.classList.contains("circle");
      const body = isCircle
        ? Bodies.circle(x, y, w / 2, { restitution: 0.9 })
        : Bodies.rectangle(x, y, w, h, { restitution: 0.9 });

      bodies.push({ el, body });
      World.add(world, body);
    });

    const walls = [
      Bodies.rectangle(window.innerWidth / 2, -50, window.innerWidth, 100, { isStatic: true }),
      Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth, 100, { isStatic: true }),
      Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true }),
      Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true }),
    ];
    World.add(world, walls);

    const update = () => {
      bodies.forEach(({ el, body }) => {
        el.style.transform = `translate(${body.position.x - el.offsetWidth / 2}px, ${body.position.y - el.offsetHeight / 2}px) rotate(${body.angle}rad)`;
      });
      requestAnimationFrame(update);
    };

    update();
  }, []);

  return null;
}
