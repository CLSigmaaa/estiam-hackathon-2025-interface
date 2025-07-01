export function filterTimeSlots(
  allSlots: string[],
  selectedSlot: string | null,
  showAll: boolean
): string[] {
  if (showAll || !selectedSlot?.includes("-")) return allSlots;
  const [rangeStart, rangeEnd] = selectedSlot.split("-");
  return allSlots.filter((slot) => {
    const [slotStart] = slot.split("-");
    return slotStart >= rangeStart && slotStart <= rangeEnd;
  });
}