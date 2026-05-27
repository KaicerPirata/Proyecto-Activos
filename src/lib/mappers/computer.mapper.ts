import { DetailedAsset } from "@/types/asset.type";
import { formComputer } from "@/types/computer.type";

// export function mapAssetToFormValues(asset: any) {
//   return {
//     id: asset.id ?? '',
//     responsable: asset.responsable?.userId ?? undefined,
//     serialNumber: asset.serialNumber ?? '',
//     networkName: asset.networkName ?? '',
//     invoiceNumber: asset.invoiceNumber ?? '',
//     purchaseDate: asset.purchaseDate
//       ? new Date(asset.purchaseDate)
//       : undefined,
//     categoryId: asset.categoryId ?? undefined,
//     category: asset.category ?? '',
//     companyId: asset.companyId ?? undefined,
//     company: asset.company ?? '',
//     areaId: asset.areaId ?? undefined,
//     area: asset.area ?? '',
//     modelId: asset.modelId ?? undefined,
//     ram: asset.ram?.map((r: any) => r.id) ?? [],
//     disk: asset.storage?.map((d: any) => d.id) ?? [],
//     osLicenseId: asset.osLicense?.licenseId ?? undefined,
//     osKey: asset.osLicense?.licenseKey ?? '',
//     officeLicenseId: asset.officeLicense?.licenseId ?? undefined,
//     officeKey: asset.officeLicense?.licenseKey ?? '',
//   };
// }

export function mapAssetToFormValues(asset: DetailedAsset) {
  const common = {
    id: asset.id,
    responsable: asset.responsable?.userId ?? undefined,
    serialNumber: asset.serialNumber,
    invoiceNumber: asset.invoice,
    purchaseDate: new Date(asset.purchaseDate),
    companyId: asset.company.companyId,
    areaId: asset.area.areaId,
    modelId: asset.model.modelId
  };

  if(asset.categoryId === 'LAP' ||
    asset.categoryId === 'SFF' ||
    asset.categoryId === 'TORR'){
    return {
      ...common,
      categoryId: asset.categoryId,
      networkName: asset.networkName ?? '',
      ram: asset.ram?.map(r=>r.id) ?? [undefined],
      storage: asset.storage?.map(d=>d.id) ?? [undefined],
      osLicenseId: asset.osLicense?.licenseId,
      osKey: asset.osLicense?.licenseKey ?? '',
      officeLicenseId: asset.officeLicense?.licenseId,
      officeKey: asset.officeLicense?.licenseKey ?? ''
    };
  }
  return {
    ...common,
    categoryId: asset.categoryId,
    details: asset.details ?? ''

  };
}

export function mapFormToComputer(data:any): formComputer {
    return {
        serialNumber: data.serialNumber,
        networkName: data.networkName,
        companyId: data.companyId,
        assetType: data.categoryId,
        invoice: data.invoiceNumber,
        purchaseDate:
            data.purchaseDate.toString(),
        internalId: data.id,
        areaId: data.areaId,
        modelId: data.modelId,
        assignedUser: data.responsable ?? null,

        memories: (data.ram ?? []).map(
            (id:number)=>({id})
        ),

        disks: (data.storage ?? []).map(
            (id:number)=>({id})
        ),

        licenses: [
            ...(data.osLicenseId
                ? [{
                    licenseId:data.osLicenseId,
                    licenseKey:data.osKey ?? ''
                }]
                : []),

            ...(data.officeLicenseId
                ? [{
                    licenseId:data.officeLicenseId,
                    licenseKey:data.officeKey ?? ''
                }]
                : [])
        ]
    };
}

// export function mapFormToComputer(data: any): formComputer {
//   return {
//     serialNumber: data.serialNumber,
//     networkName: data.networkName,
//     companyId: data.companyId, 
//     assetType: data.categoryId,
//     invoice: data.invoiceNumber,
//     purchaseDate: data.purchaseDate.toISOString().split('T')[0],
//     internalId: data.id,
//     areaId: data.areaId,
//     modelId: data.modelId,
//     assignedUser: data.responsable ?? null,

//     memories: (data.ram ?? []).map((id: number) => ({
//       id: id,
//     })),

//     disks: (data.disk ?? []).map((id: number) => ({
//       id: id,
//     })),

//     licenses: [
//       ...(data.osLicenseId
//         ? [{
//             licenseId: data.osLicenseId,
//             licenseKey: data.osKey ?? '',
//           }]
//         : []),

//       ...(data.officeLicenseId
//         ? [{
//             licenseId: data.officeLicenseId,
//             licenseKey: data.officeKey ?? '',
//           }]
//         : []),
//     ],
//   };
// }