import { Container } from "@/components/layout/container";

// TEST PAGE: temporary, only to check the header menu link. Not part of the site structure.
export default function TestPage() {
  return (
    <main className="pt-40 pb-24">
      <Container>
        <h1 className="font-heading text-3xl font-semibold text-ink">
          Тестова сторінка
        </h1>
        <p className="mt-4 text-base text-ink/70">
          Тимчасова сторінка для перевірки пункту «Тест» у меню header.
        </p>
      </Container>
    </main>
  );
}
