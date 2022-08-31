import styled from 'styled-components';
import { Input, FormGroup, Label } from 'reactstrap';

export const StyledLabel = styled(Label)`
	font-size: 0.75rem;
	font-weight: 700;
`;
export const StyledOutput = styled.p`
	font-szie: 1.2rem;
	font-weight: 500;
`;

export const ErrorMsg = styled.p`
	color: red;
`;
export const StyledTbody = styled.tbody`
	font-size: 0.79rem;
	font-weight: 500;
`;

export const StyledDivFlex2 = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
`;
export const StyledFormGroupW30 = styled(FormGroup)`
	width: 30%;
	min-width: fit-content;
`;
export const StyledFormGroupW50 = styled(FormGroup)`
	width: 49%;
	min-width: fit-content;
`;
export const StyledFormGroupW100 = styled(FormGroup)`
	width: 100%;
	min-width: fit-content;
`;

export const StyledInput = styled(Input)`
	font-size: 1.01rem;
	font-weight: 600;
`;
