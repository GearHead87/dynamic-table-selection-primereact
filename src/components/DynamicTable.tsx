import React, { useState, useEffect } from 'react';
import { DataTable, DataTablePageParams } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import axios from 'axios';

interface Artwork {
	id: number;
	title: string;
	place_of_origin: string;
	artist_display: string;
	inscriptions: string;
	date_start: number;
	date_end: number;
}

const API_URL = 'https://api.artic.edu/api/v1/artworks';

const DynamicTable: React.FC = () => {
	const [artworks, setArtworks] = useState<Artwork[]>([]);
	const [totalRecords, setTotalRecords] = useState(0);
	const [loading, setLoading] = useState(false);
	const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
	const [page, setPage] = useState(1);
	const [rows, setRows] = useState(10);

	useEffect(() => {
		fetchData(page, rows);
	}, [page, rows]);

	const fetchData = async (currentPage: number, pageSize: number) => {
		setLoading(true);
		try {
			const response = await axios.get(`${API_URL}?page=${currentPage}&limit=${pageSize}`);
			setArtworks(response.data.data);
			setTotalRecords(response.data.pagination.total);
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setLoading(false);
		}
	};

	console.log(selectedArtworks);

	const onPageChange = (e: DataTablePageParams) => {
		setPage(e.page + 1);
		setRows(e.rows);
	};

	const isRowSelected = (rowData: Artwork) => {
		return selectedArtworks.some((artwork) => artwork.id === rowData.id);
	};

	const onRowSelect = (rowData: Artwork) => {
		setSelectedArtworks((prevSelected) => {
			if (isRowSelected(rowData)) {
				return prevSelected.filter((artwork) => artwork.id !== rowData.id);
			} else {
				return [...prevSelected, rowData];
			}
		});
	};

	const onSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setSelectedArtworks([...artworks]);
		} else {
			setSelectedArtworks([]);
		}
	};

	return (
		<div className="card">
			<h2>Art Institute of Chicago - Artworks</h2>
			<DataTable
				value={artworks}
				lazy
				paginator
				first={(page - 1) * rows}
				rows={rows}
				totalRecords={totalRecords}
				loading={loading}
				onPage={onPageChange}
				dataKey="id"
				selection={selectedArtworks}
				onSelectionChange={(e) => setSelectedArtworks(e.value)}
				selectionMode="checkbox"
				showSelectAll
			>
				<Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
				<Column field="title" header="Title" />
				<Column field="place_of_origin" header="Place of Origin" />
				<Column field="artist_display" header="Artist" />
				<Column field="inscriptions" header="Inscriptions" />
				<Column field="date_start" header="Date Start" />
				<Column field="date_end" header="Date End" />
			</DataTable>

			<div className="selected-artworks">
				<h3>Selected Artworks</h3>
				<ul>
					{selectedArtworks.map((artwork) => (
						<li key={artwork.id}>{artwork.title}</li>
					))}
				</ul>
				<Button
					label="Clear Selection"
					icon="pi pi-times"
					onClick={() => setSelectedArtworks([])}
					className="p-button-danger"
				/>
			</div>
		</div>
	);
};

export default DynamicTable;
