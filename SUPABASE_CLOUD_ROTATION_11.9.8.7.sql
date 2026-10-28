-- V11.9.8.7: Bestehende Cloud-Spielstände und Tabellen bleiben unverändert.
-- Vorher: SQL-Korrekturen aus dem Chat für cloud_get/cloud_put müssen angewendet sein.
CREATE OR REPLACE FUNCTION public.looteria_cloud_rotate_code(p_old_code text, p_new_code text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $function$
DECLARE
  v_uid uuid := (SELECT auth.uid());
  v_old_hash text;
  v_new_hash text;
  v_revision bigint;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Anmeldung erforderlich'; END IF;
  IF p_old_code IS NULL OR p_old_code !~ '^[0-9A-F]{64}$'
     OR p_new_code IS NULL OR p_new_code !~ '^[0-9A-F]{64}$'
     OR p_old_code = p_new_code THEN
    RAISE EXCEPTION 'Ungültiger oder identischer Wiederherstellungscode';
  END IF;
  v_old_hash := encode(extensions.digest(p_old_code,'sha256'),'hex');
  v_new_hash := encode(extensions.digest(p_new_code,'sha256'),'hex');
  -- Only the currently authenticated owner may rotate; require knowledge of the old code.
  UPDATE public.looteria_cloud_saves
     SET recovery_hash = v_new_hash,
         revision = revision + 1,
         updated_at = now()
   WHERE owner_id = v_uid AND recovery_hash = v_old_hash
   RETURNING revision INTO v_revision;
  IF NOT FOUND THEN RAISE EXCEPTION 'Alter Code stimmt nicht mit dem Cloud-Spielstand überein'; END IF;
  RETURN jsonb_build_object('ok',true,'revision',v_revision);
EXCEPTION WHEN unique_violation THEN
  RAISE EXCEPTION 'Neuer Code ist bereits vergeben';
END;
$function$;
REVOKE ALL ON FUNCTION public.looteria_cloud_rotate_code(text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.looteria_cloud_rotate_code(text,text) TO authenticated;
