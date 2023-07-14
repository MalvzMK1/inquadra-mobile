import {InfosCourtContainer} from "./InfosCourtContainer";
import {InfosCourtCard} from "./InfosCourtCard";
import {InfosCourtSpacer} from "./InfosCourtSpacer";
import {InfoCourtCardContentHeader} from "./InfoCourtCardContentHeader";
import {InfoCourtCardContent} from "./InfoCourtCardContent";
import {InfoCourtCardContentCourtType} from "./InfoCourtCardContentCourtType";
import {InfoCourtCardContentDistance} from "./InfoCourtCardContentDistance";
import {InfoCourtCardContentRating} from "./InfoCourtCardContentRating";
import {InfoCourtCardContentPaymentProgressBar} from "./InfoCourtCardContentPaymentProgressBar";

export const InfosCourt = {
	Root: InfosCourtContainer,
	Spacer: InfosCourtSpacer,
	Court: InfosCourtCard,
	Content: InfoCourtCardContent,
	ContentHeader: InfoCourtCardContentHeader,
	ContentCourtType: InfoCourtCardContentCourtType,
	ContentDistance: InfoCourtCardContentDistance,
	ContentRating: InfoCourtCardContentRating,
	ContentPaymentProgress: InfoCourtCardContentPaymentProgressBar
}