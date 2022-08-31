import React, { useState } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import PropTypes from 'prop-types';
const PAGE_TRANSITION = 3;
const Paginate = ({ limit, total, onChange, current }) => {
	const [visible, setVisible] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	const page = Math.ceil(total / limit);
	let paging = count => {
		onChange(count);
	};
	const calculate = () => {
		if (page > 10) {
			return (
				<>
					{visible[0] > 1 ? (
						<PaginationItem key={Math.random()} disabled={true}>
							<PaginationLink href="#">...</PaginationLink>
						</PaginationItem>
					) : (
						''
					)}
					{visible.map((p, i) => (
						<PaginationItem
							key={p}
							active={p === current + 1 ? true : false}
							onClick={e => {
								if (p > 0) {
									let mVisible = [];
									visible.map(element => {
										if (current + 1 > p && visible[0] > 1 && p - 1 < page - PAGE_TRANSITION) {
											return mVisible.push(element - 1);
										} else if (current + 1 < p && visible[visible.length - 1] < page && p - 1 > PAGE_TRANSITION) {
											return mVisible.push(element + 1);
										} else {
											return (mVisible = visible);
										}
									});
									setVisible(mVisible);
								}
								paging(p - 1);
							}}
						>
							<PaginationLink href="#">{p}</PaginationLink>
						</PaginationItem>
					))}
					{visible[visible.length - 1] < page ? (
						<PaginationItem key={Math.random()} disabled={true}>
							<PaginationLink href="#">...</PaginationLink>
						</PaginationItem>
					) : (
						''
					)}{' '}
				</>
			);
		} else {
			return [...Array(page > 10 ? 10 : page)].map((p, i) => (
				<PaginationItem key={i} active={i === current ? true : false} onClick={e => onChange(i)}>
					<PaginationLink href="#">{i + 1}</PaginationLink>
				</PaginationItem>
			));
		}
	};
	return (
		<Pagination style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
			<PaginationItem
				disabled={current > 0 ? false : true}
				onClick={e => {
					if (current > 0) {
						setVisible([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
						paging(0);
					}
				}}
			>
				<PaginationLink first href="#" />
			</PaginationItem>
			<PaginationItem
				disabled={current > 0 ? false : true}
				onClick={e => {
					if (current > 0) {
						let mVisible = [];
						visible.map(element => {
							if (visible[0] > 1 && current < page - PAGE_TRANSITION) {
								return mVisible.push(element - 1);
							} else {
								return (mVisible = visible);
							}
						});
						setVisible(mVisible);
						paging(current - 1);
					}
				}}
			>
				<PaginationLink previous href="#" />
			</PaginationItem>
			{calculate()}
			<PaginationItem
				disabled={current + 1 >= page ? true : false}
				onClick={e => {
					if (current + 1 < page) {
						let mVisible = [];
						visible.map(element => {
							if (visible[visible.length - 1] < page && current > PAGE_TRANSITION) {
								return mVisible.push(element + 1);
							} else {
								return (mVisible = visible);
							}
						});
						setVisible(mVisible);
						paging(current + 1);
					}
				}}
			>
				<PaginationLink next href="#" />
			</PaginationItem>
			<PaginationItem
				disabled={current + 1 >= page ? true : false}
				onClick={e => {
					if (current < page) {
						let lastElem = page;
						let mVisible = [];
						for (let i = lastElem - 9; i <= lastElem; i++) {
							mVisible.push(i);
						}
						setVisible(mVisible);
						paging(page - 1);
					}
				}}
			>
				<PaginationLink last href="#" />
			</PaginationItem>
		</Pagination>
	);
};
Paginate.propTypes = {
	onChange: PropTypes.func.isRequired,
	limit: PropTypes.number.isRequired,
	total: PropTypes.number.isRequired,
	current: PropTypes.number.isRequired,
	style: PropTypes.object
};
export default Paginate;
