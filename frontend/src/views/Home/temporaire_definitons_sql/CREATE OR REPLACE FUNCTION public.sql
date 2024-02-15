CREATE OR REPLACE FUNCTION public.get_annonces_by_user_preferences(user_id uuid)
 RETURNS SETOF annonce
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
    user_pref RECORD;
    user_lon DOUBLE PRECISION;
    user_lat DOUBLE PRECISION;
    user_radius DOUBLE PRECISION;
BEGIN
    SELECT location, radius INTO user_pref FROM user_preferences WHERE user_preferences.user_id = $1 LIMIT 1;

    IF user_pref IS NOT NULL THEN
        -- Cast geography to geometry before using ST_X and ST_Y
        user_lon := ST_X(user_pref.location::geometry);
        user_lat := ST_Y(user_pref.location::geometry);
        user_radius := COALESCE(user_pref.radius, 50000);

        RETURN QUERY SELECT * FROM annonce
        WHERE ST_DWithin(
            annonce.geolocation_annonce,
            ST_SetSRID(ST_Point(user_lon, user_lat), 4326)::geography,
            user_radius
        );
    END IF;

    RETURN;
END;
$function$


-- variation:
CREATE OR REPLACE FUNCTION public.get_annonces_by_user_preferences(
    user_id uuid,
    p_make TEXT DEFAULT NULL,
    p_model TEXT DEFAULT NULL,
    p_color TEXT DEFAULT NULL,
    p_ram INT DEFAULT NULL,
    p_price NUMERIC DEFAULT NULL
)
RETURNS SETOF annonce AS $$
DECLARE
    user_pref RECORD;
    user_lon DOUBLE PRECISION;
    user_lat DOUBLE PRECISION;
    user_radius DOUBLE PRECISION;
BEGIN
    SELECT location, radius INTO user_pref FROM user_preferences WHERE user_preferences.user_id = user_id LIMIT 1;

    IF user_pref IS NOT NULL THEN
        user_lon := ST_X(user_pref.location::geometry);
        user_lat := ST_Y(user_pref.location::geometry);
        user_radius := COALESCE(user_pref.radius, 50000);

        RETURN QUERY SELECT * FROM annonce
        WHERE ST_DWithin(
            annonce.geolocation_annonce,
            ST_SetSRID(ST_Point(user_lon, user_lat), 4326)::geography,
            user_radius
        )
        AND (p_make IS NULL OR annonce.make = p_make)
        AND (p_model IS NULL OR annonce.model = p_model)
        AND (p_color IS NULL OR annonce.color = p_color)
        AND (p_ram IS NULL OR annonce.ram = p_ram)
        AND (p_price IS NULL OR annonce.price = p_price);
    END IF;

    RETURN;
END;
$$ LANGUAGE plpgsql STABLE;
