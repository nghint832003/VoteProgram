use anchor_lang::prelude::*;

declare_id!("6KwYLjSX3d4badXVPz9opEDF1P4ptog9kHUXvYPw7LzB");

#[program]
pub mod vote_program {
    use super::*;

    pub fn add_candidate(ctx: Context<AddCandidate>, nickname: String) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate;
        candidate.nickname = nickname;
        candidate.vote_count = 0;
        Ok(())
    }

    pub fn vote_for_candidate(ctx: Context<VoteForCandidate>) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate;
        candidate.vote_count += 1;
        Ok(())
    }

    pub fn get_vote_count(ctx: Context<GetVoteCount>) -> Result<u64> {
        let candidate = &ctx.accounts.candidate;
        Ok(candidate.vote_count)
    }
}

#[derive(Accounts)]
pub struct AddCandidate<'info> {
    #[account(init, payer = user, space = 8 + 32 + 8)]
    pub candidate: Account<'info, Candidate>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VoteForCandidate<'info> {
    #[account(mut)]
    pub candidate: Account<'info, Candidate>,
}

#[derive(Accounts)]
pub struct GetVoteCount<'info> {
    pub candidate: Account<'info, Candidate>,
}

#[account]
pub struct Candidate {
    pub nickname: String,
    pub vote_count: u64,
}
