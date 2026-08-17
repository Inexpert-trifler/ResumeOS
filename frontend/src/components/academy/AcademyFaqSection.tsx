"use client";

import { FadeUp } from "@/animations/FadeUp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "Do I really need to tailor my resume for every job?",
    answer: "Yes, but you don't need to rewrite it from scratch. Keep a 'master resume' with all your experience, and copy/paste the most relevant bullet points for specific applications. Our AI Builder does this automatically.",
  },
  {
    question: "Should I include a photo?",
    answer: "If you are applying in the US, UK, or Canada, absolutely not. It introduces unconscious bias and can mess up ATS parsing. If you are applying in parts of Europe or Asia, it is sometimes expected.",
  },
  {
    question: "How far back should my experience go?",
    answer: "Generally, 10-15 years is the maximum. Anything older is usually irrelevant to modern tech stacks and opens you up to age discrimination. Focus on recent, high-impact roles.",
  },
  {
    question: "What if I have employment gaps?",
    answer: "Be honest but strategic. If the gap was for education, travel, or family care, state it simply. You can also use years instead of months (e.g., 2020-2022) to minimize the visual impact of short gaps.",
  },
];

export function AcademyFaqSection() {
  return (
    <section id="faqs" className="py-12 pb-32">
      <FadeUp>
        <div className="inline-block px-3 py-1 mb-6 rounded-full bg-accent/10 text-accent text-sm font-semibold tracking-wide uppercase">
          Section 10: FAQs
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
          Final Questions
        </h2>
      </FadeUp>

      <FadeUp delay={0.1}>
        <Accordion className="w-full max-w-3xl">
          {FAQS.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border/50 px-2 bg-card rounded-lg mb-2 shadow-sm border">
              <AccordionTrigger className="text-left text-lg hover:text-accent hover:no-underline py-4 px-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-4 px-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </FadeUp>
    </section>
  );
}
