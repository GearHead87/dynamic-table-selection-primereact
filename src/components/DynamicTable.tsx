import React, { useState, useEffect, useRef } from 'react';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import axios from 'axios';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputText } from 'primereact/inputtext';
import { Artwork } from '../types';

const API_URL = 'https://api.artic.edu/api/v1/artworks';

const DynamicTable: React.FC = () => {
	const [artworks, setArtworks] = useState<Artwork[]>([]);
	const [totalRecords, setTotalRecords] = useState(0);
	const [loading, setLoading] = useState(false);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [page, setPage] = useState(1);
	const [rows, setRows] = useState(10);
	const op = useRef<OverlayPanel | null>(null);

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

	const isItemSelected = (index: number) => {
		return selectedItems.includes(index);
	};

	const toggleSelection = (index: number) => {
		const itemNumber = index;
		setSelectedItems((prev) => {
			if (prev.includes(itemNumber)) {
				return prev.filter((num) => num !== itemNumber);
			} else {
				return [...prev, itemNumber];
			}
		});
	};

	const onPageChange = (e: DataTableStateEvent) => {
		if (!e.page) return;

		setPage(e.page + 1);
		setRows(e.rows);
	};

	const handleCustomSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
		const numbers = e.target.value
			.split(',')
			.map((num) => parseInt(num.trim(), 10))
			.filter((num) => !isNaN(num));
		setSelectedItems(numbers);
	};

	const renderOverlayButton = () => {
		const toggleOverlay = (e: React.MouseEvent) => {
			if (op.current) {
				op.current.toggle(e);
			}
		};
		return (
			<>
				<Button
					type="button"
					icon="pi pi-angle-down"
					className="p-button-rounded p-button-text"
					onClick={toggleOverlay}
				/>
				<OverlayPanel ref={op}>
					<InputText
						type="text"
						placeholder="Enter numbers (e.g., 11, 12, 14)"
						defaultValue={selectedItems.join(', ')}
						onChange={handleCustomSelection}
					/>
				</OverlayPanel>
			</>
		);
	};

	return (
		<div className="card">
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
			>
				<Column
					headerStyle={{ width: '3em' }}
					body={(_rowData, { rowIndex }) => (
						<Checkbox
							checked={isItemSelected(rowIndex)}
							onChange={() => toggleSelection(rowIndex)}
						/>
					)}
				/>
				<Column header={renderOverlayButton} style={{ width: '4em' }} />
				<Column field="title" header="Title" />
				<Column field="place_of_origin" header="Place of Origin" />
				<Column field="artist_display" header="Artist" />
				<Column field="inscriptions" header="Inscriptions" />
				<Column field="date_start" header="Date Start" />
				<Column field="date_end" header="Date End" />
			</DataTable>
		</div>
	);
};

export default DynamicTable;
