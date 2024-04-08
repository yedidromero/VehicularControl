use anchor_lang::prelude::*;

#[error_code]
pub enum TodoError {
    #[msg("You are not authenticated")]
    Unauthorized,
    #[msg("You are not allowed")]
    NotAllowed,
    #[msg("Math operation overflow")]
    MathOverflow,
    #[msg("Already marked")]
    AlreadyMarked,
}