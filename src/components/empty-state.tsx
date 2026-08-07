import Link from "next/link";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="col-span-full rounded-lg border border-dashed p-10 text-center">
      <p className="font-heading text-sm font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      <Link
        href="/studio"
        className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-3 hover:opacity-80"
      >
        Open the Sanity Studio
      </Link>
    </div>
  );
}
