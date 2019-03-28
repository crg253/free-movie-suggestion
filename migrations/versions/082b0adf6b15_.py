"""

Revision ID: 082b0adf6b15
Revises: 
Create Date: 2019-03-28 12:46:53.118917

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '082b0adf6b15'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('movie',
    sa.Column('movie_id', sa.Integer(), nullable=False),
    sa.Column('uniquename', sa.String(length=200), nullable=True),
    sa.Column('name', sa.String(length=200), nullable=True),
    sa.Column('year', sa.Integer(), nullable=True),
    sa.Column('video_link', sa.String(length=1000), nullable=True),
    sa.PrimaryKeyConstraint('movie_id')
    )
    op.create_table('tag',
    sa.Column('tag_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('tag_id')
    )
    op.create_table('tags',
    sa.Column('movie_id', sa.Integer(), nullable=False),
    sa.Column('tag_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['movie_id'], ['movie.movie_id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.tag_id'], ),
    sa.PrimaryKeyConstraint('movie_id', 'tag_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('tags')
    op.drop_table('tag')
    op.drop_table('movie')
    # ### end Alembic commands ###
