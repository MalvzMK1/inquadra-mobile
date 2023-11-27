import { InfosEstablishmentContainer } from "./InfosEstablishmentContainer";
import { InfosEstablishmentCard } from "./InfosEstablishmentCard";
import { InfosEstablishmentSpacer } from "./InfosEstablishmentSpacer";
import { InfoEstablishmentCardContentHeader } from "./InfoEstablishmentCardContentHeader";
import { InfoEstablishmentCardContent } from "./InfoEstablishmentCardContent";
import { InfoEstablishmentCardContentTitle } from "./InfoEstablishmentCardContentTitle";
import { InfoEstablishmentCardContentDistance } from "./InfoEstablishmentCardContentDistance";
import { InfoEstablishmentCardContentPaymentProgressBar } from "./InfoCourtEstablishmentContentPaymentProgressBar";

export const InfosEstablishment = {
	Root: InfosEstablishmentContainer,
	Spacer: InfosEstablishmentSpacer,
	Establishment: InfosEstablishmentCard,
	Content: InfoEstablishmentCardContent,
	ContentHeader: InfoEstablishmentCardContentHeader,
	ContentCourtType: InfoEstablishmentCardContentTitle,
	ContentDistance: InfoEstablishmentCardContentDistance,
	ContentPaymentProgress: InfoEstablishmentCardContentPaymentProgressBar
}