#[dependencies]
solana-program = { version = "1.9.3" }
spl-token = { version = "3.3.2" , features = ["fixed-point"] }  

use solana_program::program::Program

use anchor_lang::prelude::*;

declare_id!("3oHznaaGzwAcyQE8URryZGbqNBJorEjbqE6aLZBWUvZ1");

#[program]
pub mod mi_smart_contract {
    use super::*;

    pub fn guardar_datos(ctx: Context<GuardarDatos>, datos: String) -> ProgramResult {
        let mi_contrato = &mut ctx.accounts.mi_contrato;
        mi_contrato.datos = datos;
        Ok(())
    }
}

#[account]
pub struct MiContrato {
    pub datos: String,
}

#[derive(Accounts)]
pub struct GuardarDatos<'info> {
    #[account(init, payer = user, space = 8 + 256)] // Ajusta el espacio según tus necesidades
    pub mi_contrato: Account<'info, MiContrato>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
