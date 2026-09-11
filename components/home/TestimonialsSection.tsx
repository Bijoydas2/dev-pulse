import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "DevPulse gives the quiet work between launches a shape I can actually see.",
    name: "Maya Chen",
    role: "Independent developer",
  },
  {
    quote: "The project showcase makes it easy to explain what I am building without writing a case study every time.",
    name: "Jordan Ellis",
    role: "Product engineer",
  },
  {
    quote: "A small daily signal became the habit that kept my side project moving.",
    name: "Sam Rivera",
    role: "Open source maintainer",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Built by builders</p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">Momentum feels better when it is visible.</h2>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.name} className="rounded-2xl border border-white/10 bg-zinc-900 p-6 sm:p-7">
            <Quote aria-hidden="true" size={22} className="text-emerald-300" />
            <blockquote className="mt-6 text-base leading-7 text-zinc-300">“{testimonial.quote}”</blockquote>
            <figcaption className="mt-7 border-t border-white/8 pt-4">
              <p className="text-sm font-semibold text-white">{testimonial.name}</p>
              <p className="mt-1 text-xs text-zinc-500">{testimonial.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
