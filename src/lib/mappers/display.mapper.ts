
export function mapRamIdsToDisplay(ram: number[], memories: any[]) {
  return ram
    .map(id => memories.find(mem => mem.memoryId === id))
    .filter(Boolean)
    .map(mem => `${mem.gbCapacity}GB ${mem.memoryType}`);
}

export function mapDiskIdsToDisplay(disk: number[], disks: any[]) {
  return disk
    .map(id => disks.find(disk => disk.diskId === id))
    .filter(Boolean)
    .map(disk => `${disk.gbCapacity}GB ${disk.diskType}`);
}