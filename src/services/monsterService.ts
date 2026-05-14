import { supabase } from './supabaseClient';
import type { MonsterFormData, MonsterRecord } from '../types/monster';

const MONSTER_IMAGES_BUCKET = 'monster-images';

export async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Usuário não autenticado.');
  }

  return data.user.id;
}

export async function listMyMonsters(): Promise<MonsterRecord[]> {
  const { data, error } = await supabase
    .from('monsters')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as MonsterRecord[];
}

export async function createMonster(formData: MonsterFormData): Promise<MonsterRecord> {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from('monsters')
    .insert({
      user_id: userId,
      name: formData.name,
      image_url: formData.image_url ?? null,

      strength: formData.strength,
      agility: formData.agility,
      intelligence: formData.intelligence,
      willpower: formData.willpower,

      hp: formData.hp,
      mp: formData.mp,
      defense: formData.defense,
      evasion: formData.evasion,
      determination: formData.determination,

      attacks: formData.attacks,
      abilities: formData.abilities,
      notes: formData.notes || null,
      is_public: formData.is_public,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const createdMonster = data as MonsterRecord;

  if (formData.imageFile) {
    const imageUrl = await uploadMonsterImage(
      userId,
      createdMonster.id,
      formData.imageFile
    );

    const updatedMonster = await updateMonster(createdMonster.id, {
      ...formData,
      image_url: imageUrl,
      imageFile: null,
    });

    return updatedMonster;
  }

  return createdMonster;
}

export async function updateMonster(
  monsterId: string,
  formData: MonsterFormData
): Promise<MonsterRecord> {
  const userId = await getCurrentUserId();

  let imageUrl = formData.image_url ?? null;

  if (formData.imageFile) {
    imageUrl = await uploadMonsterImage(userId, monsterId, formData.imageFile);
  }

  const { data, error } = await supabase
    .from('monsters')
    .update({
      name: formData.name,
      image_url: imageUrl,

      strength: formData.strength,
      agility: formData.agility,
      intelligence: formData.intelligence,
      willpower: formData.willpower,

      hp: formData.hp,
      mp: formData.mp,
      defense: formData.defense,
      evasion: formData.evasion,
      determination: formData.determination,

      attacks: formData.attacks,
      abilities: formData.abilities,
      notes: formData.notes || null,
      is_public: formData.is_public,
    })
    .eq('id', monsterId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as MonsterRecord;
}

export async function deleteMonster(monsterId: string): Promise<void> {
  const { error } = await supabase
    .from('monsters')
    .delete()
    .eq('id', monsterId);

  if (error) {
    throw new Error(error.message);
  }
}

async function uploadMonsterImage(
  userId: string,
  monsterId: string,
  file: File
): Promise<string> {
  const fileExtension = file.name.split('.').pop() || 'png';
  const filePath = `${userId}/${monsterId}.${fileExtension}`;

  const { error } = await supabase.storage
    .from(MONSTER_IMAGES_BUCKET)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    throw new Error(error.message);
  }

  return filePath;
}

export async function createSignedMonsterImageUrl(
  imagePath: string | null
): Promise<string | null> {
  if (!imagePath) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(MONSTER_IMAGES_BUCKET)
    .createSignedUrl(imagePath, 60 * 60);

  if (error) {
    throw new Error(error.message);
  }

  return data.signedUrl;
}