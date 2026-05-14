import { supabase } from './supabaseClient';

export type RpgCollection = 'monsters' | 'items' | 'shops' | 'players';

interface RpgRecordRow<T> {
  id: string;
  collection: RpgCollection;
  payload: T;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

async function ensureAuthenticatedUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Entre no modo mestre para salvar no Supabase.');
  }

  return data.user;
}

function getIsHiddenFromPayload(payload: any): boolean {
  return Boolean(payload?.oculto || payload?.isHidden || payload?.is_hidden);
}

function normalizePayload<T extends { id: string }>(payload: T): T {
  return {
    ...payload,
    id: String(payload.id),
  };
}

export async function listRpgRecords<T>(
  collection: RpgCollection,
): Promise<T[]> {
  const { data, error } = await supabase
    .from('rpg_records')
    .select('id, collection, payload, is_hidden, created_at, updated_at')
    .eq('collection', collection)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as RpgRecordRow<T>[];

  console.log('Dados carregados do Supabase:', collection, rows);

  return rows.map((row) => row.payload);
}

export async function upsertRpgRecord<T extends { id: string }>(
  collection: RpgCollection,
  payload: T,
): Promise<T> {
  await ensureAuthenticatedUser();

  const normalizedPayload = normalizePayload(payload);

  const { data, error } = await supabase
    .from('rpg_records')
    .upsert(
      {
        id: normalizedPayload.id,
        collection,
        payload: normalizedPayload,
        is_hidden: getIsHiddenFromPayload(normalizedPayload),
      },
      {
        onConflict: 'id',
      },
    )
    .select('id, collection, payload, is_hidden, created_at, updated_at')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  console.log('Registro salvo no Supabase:', collection, data);

  return (data as RpgRecordRow<T>).payload;
}

export async function deleteRpgRecord(id: string): Promise<void> {
  await ensureAuthenticatedUser();

  const { error } = await supabase
    .from('rpg_records')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  console.log('Registro removido do Supabase:', id);
}

export async function replaceRpgCollection<T extends { id: string }>(
  collection: RpgCollection,
  payloads: T[],
): Promise<void> {
  await ensureAuthenticatedUser();

  const normalizedPayloads = payloads.map(normalizePayload);

  const { data: existingRows, error: listError } = await supabase
    .from('rpg_records')
    .select('id')
    .eq('collection', collection);

  if (listError) {
    throw new Error(listError.message);
  }

  const nextIds = new Set(normalizedPayloads.map((payload) => payload.id));

  const idsToDelete = (existingRows ?? [])
    .map((row) => String(row.id))
    .filter((id) => !nextIds.has(id));

  if (idsToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('rpg_records')
      .delete()
      .in('id', idsToDelete);

    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  if (normalizedPayloads.length === 0) {
    console.log('Coleção salva no Supabase:', collection, []);
    return;
  }

  const rows = normalizedPayloads.map((payload) => ({
    id: payload.id,
    collection,
    payload,
    is_hidden: getIsHiddenFromPayload(payload),
  }));

  const { error: upsertError } = await supabase
    .from('rpg_records')
    .upsert(rows, {
      onConflict: 'id',
    });

  if (upsertError) {
    throw new Error(upsertError.message);
  }

  console.log('Coleção salva no Supabase:', collection, normalizedPayloads);
}