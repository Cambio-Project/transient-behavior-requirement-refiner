export class PSPConstants {

	// Scopes
	public static readonly S_Globally: number = 1;
	public static readonly S_BeforeR: number = 2;
	public static readonly S_AfterQ: number = 3;
	public static readonly S_BetweenQandR: number = 4;
	public static readonly S_AfterQuntilR: number = 5;

	// Patterns

	// Pattern Class
	public static readonly PC_Occurrence: number = 1;
	public static readonly PC_Order: number = 2;

	// Occurrence
	public static readonly P_Universality: number = 1;
	public static readonly P_Absence: number = 2;
	public static readonly P_Existence: number = 3;
	public static readonly P_BoundedExistence: number = 4;
	public static readonly P_TransientState: number = 5;
	public static readonly P_SteadyState: number = 6;
	public static readonly P_MinimumDuration: number = 7;
	public static readonly P_MaximumDuration: number = 8;
	public static readonly P_Recurrence: number = 9;

	public static readonly P_LastOccurrence: number = PSPConstants.P_Recurrence;

	// Order
	public static readonly P_Precedence: number = PSPConstants.P_LastOccurrence + 1;
	public static readonly P_PrecedenceChain1N: number = 11;
	public static readonly P_PrecedenceChainN1: number = 12;
	public static readonly P_Until: number = 13;
	public static readonly P_Response: number = 14;
	public static readonly P_ResponseChain1N: number = 15;
	public static readonly P_ResponseChainN1: number = 16;
	public static readonly P_ResponseInvariance: number = 17;

	public readonly P_LastOrder: number = PSPConstants.P_ResponseInvariance;

	// Constraints
	public static readonly C_Event: number = 1;
	public static readonly C_Time: number = 2;
	public static readonly C_Probability: number = 3;

	// Time
	public static readonly CT_Upper: number = 1;
	public static readonly CT_Lower: number = 2;
	public static readonly CT_Interval: number = 3;

	// Probability
	public static readonly CP_Lower: number = 1;
	public static readonly CP_LowerEqual: number = 2;
	public static readonly CP_Greater: number = 3;
	public static readonly CP_GreaterEqual: number = 4;
}
