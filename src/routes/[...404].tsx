import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <section class="mx-auto max-w-lg text-center">
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1 class="mb-2 text-3xl font-bold tracking-tight">Page Not Found</h1>
      <p class="mb-4 text-sm text-gray-600">
        The page you’re looking for doesn’t exist.
      </p>
      <a href="/" class="text-blue-600 hover:underline">Go back home</a>
    </section>
  );
}
