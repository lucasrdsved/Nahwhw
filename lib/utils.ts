/**
 * Aguarda por um determinado número de milissegundos.
 * Usado para simular a latência da rede no backend mock.
 * @param ms - O número de milissegundos para aguardar.
 */
export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
