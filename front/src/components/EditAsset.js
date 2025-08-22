import React from 'react';
import { useParams } from 'react-router-dom';
import AssetForm from './AssetForm';

function EditAsset() {
  const { id } = useParams();
  return <AssetForm assetId={id} />;
}

export default EditAsset;
