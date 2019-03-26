import React, { Component } from 'react';
import './App.css';
let SEAT_NO = 0;
let ROWS = 10;
let COLS = 3;

const TableRow = (props) => {
	return (
		<td>
			<button
				className={
					props.isAvailable ? (
						[ 'btn', 'btn-available', 'btn-available-i' ].join(' ')
					) : (
						[ 'btn', 'btn-booked', 'btn-booked-i' ].join(' ')
					)
				}
				onClick={props.book}
			>
				{props.ic}
			</button>
		</td>
	);
};

class App extends Component {
	state = {
		rows       : [],
		row        : 10,
		col        : 4,
		seatLeft   : ROWS * COLS,
		seatBooked : 0,
	};

	filler = () => {
		SEAT_NO = 0;
		let rows = [];
		for (let i = 1; i <= ROWS; i++) {
			let seat = [];
			let letterCode = String.fromCharCode(i + 64);
			let col = 1;
			for (let j = 1; j <= COLS; j++) seat.push({ available: true, seatNo: ++SEAT_NO, ic: letterCode + col++ });
			rows.push(seat);
		}
		this.setState({
			rows,
			seatLeft   : ROWS * COLS,
			seatBooked : 0,
		});
	};
	componentDidMount() {
		this.filler();
	}

	handleRowChange = (event) => {
		let row = +event.target.value;
		if (row > 26) row = 26;
		else if (row < 1) row = 1;
		this.setState({ row });
	};
	handleColChange = (event) => {
		let col = +event.target.value;
		if (col > 6) col = 6;
		else if (col < 0) col = 0;
		this.setState({ col });
	};
	changeRowCol = () => {
		ROWS = this.state.row;
		COLS = this.state.col;
		this.filler();
	};
	book = (seatNo) => {
		let rows = this.state.rows.map((row) =>
			row.map((seat) => {
				if (seat.seatNo !== seatNo) return seat;
				else {
					if (seat.available)
						this.setState((prevState) => ({
							seatLeft   : prevState.seatLeft - 1,
							seatBooked : prevState.seatBooked + 1,
						}));
					else
						this.setState((prevState) => ({
							seatLeft   : prevState.seatLeft + 1,
							seatBooked : prevState.seatBooked - 1,
						}));
					return {
						available : !seat.available,
						seatNo    : seat.seatNo,
						ic        : seat.ic,
					};
				}
			})
		);
		this.setState({ rows });
		console.log(seatNo);
	};

	render() {
		return (
			<div>
				<table>
					<tbody>
						{this.state.rows.map((row, index) => (
							<tr key={index}>
								{row.map((seat) => (
									<TableRow
										book={() => this.book(seat.seatNo)}
										isAvailable={seat.available}
										ic={seat.ic}
										key={seat.ic}
									/>
								))}
							</tr>
						))}
					</tbody>
				</table>
				<div style={{ padding: 10, position: 'fixed', top: 10, right: 10 }}>
					<p style={{ color: 'grey' }}>Log</p>
					<p>
						Seat Booked: <strong style={{ color: 'red' }}>{this.state.seatBooked}</strong>
					</p>
					<p>
						Seat Left: <strong style={{ color: 'green' }}>{this.state.seatLeft}</strong>
					</p>
				</div>
				<div style={{ padding: 10, position: 'fixed', bottom: 10, right: 10 }}>
					<input
						style={{ width: 50 }}
						type="number"
						value={+this.state.row}
						onChange={this.handleRowChange}
					/>
					<button onClick={() => this.changeRowCol()}>Update Row</button>
					<br />
					<br />
					<input
						style={{ width: 50 }}
						type="number"
						value={+this.state.col}
						onChange={this.handleColChange}
					/>
					<button onClick={() => this.changeRowCol()}>Update Column</button>
				</div>
			</div>
		);
	}
}

export default App;
