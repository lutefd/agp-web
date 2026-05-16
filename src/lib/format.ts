export function formatStatus(status: string) {
	return ({ pending: 'Pendente', confirmed: 'Confirmado', disputed: 'Contestado', cancelled: 'Cancelado' } as Record<string, string>)[status] ?? status;
}

export function formatDate(value: Date | string) {
	return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
