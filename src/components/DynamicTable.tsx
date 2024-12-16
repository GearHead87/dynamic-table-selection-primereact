// src/components/ArtworkTable.tsx
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Artwork } from '../types';

const DynamicTable: React.FC = () => {
	const [artworks, setArtworks] = useState<Artwork[]>([]);
	const [totalRecords, setTotalRecords] = useState(0);
	const [loading, setLoading] = useState(false);
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(10);
	const [selectedProducts, setSelectedProducts] = useState();

	console.log(selectedProducts);

	useEffect(() => {
		fetchArtworks();
	}, [first, rows]);

	const fetchArtworks = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`https://api.artic.edu/api/v1/artworks?page=${first / rows + 1}&limit=${rows}`
			);
			const data = await response.json();
			setArtworks(data.data);
			setTotalRecords(data.info.total_records);
		} catch (error) {
			console.error('Error fetching artworks:', error);
		} finally {
			setLoading(false);
		}
	};

	const onPageChange = (event: any) => {
		setFirst(event.first);
		setRows(event.rows);
	};

	return (
		<DataTable
			value={artworks}
			paginator
			paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
			first={first}
			rows={rows}
			totalRecords={totalRecords}
			onPage={onPageChange}
			loading={loading}
			selectionMode="checkbox"
			// selectionMode={rowClick ? null : 'checkbox'}
			selection={selectedProducts}
			onSelectionChange={(e) => setSelectedProducts(e.value)}
		>
			<Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
			<Column field="title" header="Title" />
			<Column field="place_of_origin" header="Place of Origin" />
			<Column field="artist_display" header="Artist" />
			<Column field="inscriptions" header="Inscriptions" />
			<Column field="date_start" header="Start Date" />
			<Column field="date_end" header="End Date" />
		</DataTable>
	);
};

export default DynamicTable;
