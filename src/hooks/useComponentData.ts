// client/src/hooks/useComponentData.ts

import { useQuery, useQueryClient } from '@tanstack/react-query';

type ComponentMetadata = {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  // Add other lightweight fields as needed
};

type ComponentDetails = ComponentMetadata & {
  code?: string;
  htmlCode?: string;
  cssCode?: string;
  jsCode?: string;
  // Add other full-detail fields as needed
};

/**
 * Fetch a lightweight list of component metadata (no code fields).
 */
async function fetchComponentMetadata(): Promise<ComponentMetadata[]> {
  const res = await fetch('/api/components/metadata');
  if (!res.ok) throw new Error('Failed to fetch component metadata');
  return res.json();
}

/**
 * Fetch full details for a specific component by ID (including code fields).
 */
async function fetchComponentDetails(id: string): Promise<ComponentDetails> {
  const res = await fetch(`/api/components/${id}`);
  if (!res.ok) throw new Error('Failed to fetch component details');
  return res.json();
}

/**
 * Hook to get and cache the component metadata list.
 * @param options Optional: { refetchInterval } for background refresh (ms)
 */
export function useComponentMetadata(options?: { refetchInterval?: number }) {
  return useQuery<ComponentMetadata[]>({
    queryKey: ['component-metadata'],
    queryFn: fetchComponentMetadata,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: options?.refetchInterval,
  });
}

/**
 * Hook to get and cache full details for a specific component by ID.
 */
export function useComponentDetails(id: string) {
  return useQuery<ComponentDetails>({
    queryKey: ['component-details', id],
    queryFn: () => fetchComponentDetails(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/* =========================
   Usage Examples
   =========================

import { useComponentMetadata, useComponentDetails } from './useComponentData';

// Example: Fetch and display metadata list
function ComponentList() {
  const { data: metadata, isLoading } = useComponentMetadata();
  if (isLoading) return <div>Loading...</div>;
  return (
    <ul>
      {metadata?.map((c) => (
        <li key={c.id}>{c.name}</li>
      ))}
    </ul>
  );
}

// Example: Fetch and display details for a component
function ComponentDetail({ id }: { id: string }) {
  const { data: details, isLoading } = useComponentDetails(id);
  if (isLoading) return <div>Loading...</div>;
  if (!details) return <div>Not found</div>;
  return (
    <div>
      <h2>{details.name}</h2>
      <pre>{details.code}</pre>
    </div>
  );
}

*/