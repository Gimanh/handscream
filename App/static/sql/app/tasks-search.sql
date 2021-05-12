SELECT ci.*,
       c.text          AS item_comment_text,
       c.id            AS item_comment_id,
       c.date_creation AS item_comment_date_creation,
       c.item_id       AS item_comment_parent_id,
       c.owner         AS item_comment_owner,
       r.id            AS item_reminder_id,
       r.item_id       AS item_reminder_parent_id,
       r.date          AS item_reminder_exp_date,
       r.date_creation AS item_reminder_date_creation,
       r.owner         AS item_reminder_owner
FROM checklist_item as ci
         LEFT JOIN comment AS c ON c.item_id = ci.id
         LEFT JOIN reminder AS r ON r.item_id = ci.id
WHERE ci.parent_id = @listId AND ci.checked = @checked AND ci.description LIKE @description @sorting
LIMIT @limit OFFSET @offset;
