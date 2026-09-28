-- Allow founders to delete leads from /admin and release the slot when applicable.
GRANT DELETE ON public.consultation_bookings TO authenticated;

DROP POLICY IF EXISTS "Admins can delete bookings" ON public.consultation_bookings;
CREATE POLICY "Admins can delete bookings"
ON public.consultation_bookings FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
